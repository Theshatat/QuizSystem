using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizSystem.Data;
using QuizSystem.Models;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
[Authorize(AuthenticationSchemes = "Bearer")]
public class QuizessController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public QuizessController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Quiz
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Quiz>>> GetQuiz()
    {
        return await _context.Quizzes
            .Include(x=>x.Questions)
            .ToListAsync();
    }

    // GET: api/Quiz/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Quiz>> GetQuiz(int id)
    {
        var quiz = await _context.Quizzes
         .Include(q => q.Questions)
         .FirstOrDefaultAsync(q => q.Id == id);

        if (quiz == null)
        {
            return NotFound();
        }

        return quiz;
    }

    // PUT: api/Quiz/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutQuiz(int? id, Quiz quiz)
    {
        if (id != quiz.Id)
        {
            return BadRequest();
        }

        _context.Entry(quiz).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!QuizExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/Quiz
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Quiz>> PostQuiz(Quiz quiz)
    {
        _context.Quizzes.Add(quiz);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetQuiz", new { id = quiz.Id }, quiz);
    }

    // DELETE: api/Quiz/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuiz(int? id)
    {
        var quiz = await _context.Quizzes.FindAsync(id);
        if (quiz == null)
        {
            return NotFound();
        }

        _context.Quizzes.Remove(quiz);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool QuizExists(int? id)
    {
        return _context.Quizzes.Any(e => e.Id == id);
    }

    [HttpGet("TakeQuiz/{id}")]
    [Authorize]
    public async Task<IActionResult> TakeQuiz(int id)
    {
        var quiz = await _context.Quizzes
            .Include(q => q.Questions)
                .ThenInclude(q => q.Answers)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (quiz == null)
            return NotFound();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var attempt = await _context.QuizAttempts
            .FirstOrDefaultAsync(a => a.QuizId == quiz.Id && a.UserId == userId);

        if (attempt == null)
        {
            attempt = new QuizAttempt
            {
                QuizId = quiz.Id,
                UserId = userId,
                StaretedAt = DateTime.Now,
                TotalQuestions = quiz.Questions.Count,
                Score = 0
            };

            _context.QuizAttempts.Add(attempt);
            await _context.SaveChangesAsync();
        }
        // Map to student-safe DTO — no IsCorrect anywhere in this
        // you now manually build a new object graph (quizDto) that mirrors the shape of quiz but selectively excludes IsCorrect,
        // and you return that instead of quiz itself.
        var quizDto = new QuizForStudentDto
        {
            Id = quiz.Id,
            Title = quiz.Title,
            Description = quiz.Description,
            DurationInMinutes = quiz.DurationInMinutes,
            Questions = quiz.Questions.Select(q => new QuestionForStudentDto
            {
                Id = q.Id,
                Text = q.Text,
                ImageUrl = q.ImageUrl,
                Answers = q.Answers.Select(a => new AnswerForStudentDto
                {
                    Id = a.Id,
                    Text = a.Text
                    // IsCorrect deliberately omitted
                }).ToList()
            }).ToList()
        };
        return Ok(new
        {
            AttemptId = attempt.Id,
            Quiz = quizDto
        });
    }

    [HttpPost("SubmitQuiz")]
    [Authorize]
    public async Task<IActionResult> SubmitQuiz([FromBody] SubmitQuizDto dto)
    {
        var quiz = await _context.Quizzes
            .Include(q => q.Questions)
                .ThenInclude(q => q.Answers)
            .FirstOrDefaultAsync(q => q.Id == dto.QuizId);

        if (quiz == null)
            return NotFound();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var attempt = await _context.QuizAttempts
            .FirstOrDefaultAsync(a =>
                a.Id == dto.AttemptId &&
                a.QuizId == dto.QuizId &&
                a.UserId == userId);

        if (attempt == null)
            return NotFound();

        var elapsed = DateTime.Now - attempt.StaretedAt;
        bool timeExceeded = elapsed.TotalMinutes > quiz.DurationInMinutes;
        int score = 0;

        foreach (var question in quiz.Questions)
        {
            if (dto.Answers.ContainsKey(question.Id))
            {
                var selectedAnswerId = dto.Answers[question.Id];

                var correctAnswer = question.Answers
                    .FirstOrDefault(a => a.IsCorrect);

                if (correctAnswer != null &&
                    correctAnswer.Id == selectedAnswerId)
                {
                    score++;
                }
            }
        }

        attempt.Score = score;
        attempt.FinishedAt = DateTime.Now;

        _context.Update(attempt);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            AttemptId = attempt.Id,
            Score = score,
            TotalQuestions = attempt.TotalQuestions,
            TimeExceeded = timeExceeded
        });
    }
    [HttpGet("Result/{attemptId}")]
    [Authorize]
    public async Task<IActionResult> Result(int attemptId)
    {
        var attempt = await _context.QuizAttempts
            .Include(a => a.Quiz)
                .ThenInclude(q => q.Questions)
            .FirstOrDefaultAsync(a => a.Id == attemptId);

        if (attempt == null)
            return NotFound();

        return Ok(attempt);
    }
}

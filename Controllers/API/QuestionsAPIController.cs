using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizSystem.Data;
using QuizSystem.Models;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
[Authorize(AuthenticationSchemes = "Bearer")]
public class QuestionsAPIController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public QuestionsAPIController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Question
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Question>>> GetQuestion()
    {
        return await _context.Questions.ToListAsync();
    }

    // GET: api/Question/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Question>> GetQuestion(int id)
    {
        var question = await _context.Questions
            .Include(q=>q.Answers)
            .FirstOrDefaultAsync(q=>q.Id == id);

        if (question == null)
        {
            return NotFound();
        }

        return question;
    }

    // PUT: api/Question/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutQuestion(int id, QuestionDto question)
    {
        var existingQuestion = await _context.Questions
            .Include(q => q.Answers)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (existingQuestion == null) {
            return NotFound();
        }

        var quiz = await _context.Quizzes.FindAsync(existingQuestion.QuizId);
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if(quiz == null || quiz.InstructorId != userId)
        {
            return Forbid();
        }

        existingQuestion.Text = question.Text;
        existingQuestion.ImageUrl = question.ImageUrl;
        existingQuestion.Order = question.Order;

        foreach (var incomingAnswer in question.Answers)
        {
            var existingAnswer = existingQuestion.Answers
                .FirstOrDefault(a => a.Id == incomingAnswer.Id);

            if (existingAnswer != null)
            {
                existingAnswer.Text = incomingAnswer.Text;
                existingAnswer.IsCorrect = incomingAnswer.IsCorrect;
            }
        }
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!QuestionExists(id))
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

    // POST: api/Question
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost("{quizId}")]
    public async Task<ActionResult<Question>> PostQuestion(int quizId, QuestionDto question)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if(userId == null)
        {
            return Unauthorized();
        }

        var quiz = await _context.Quizzes.FindAsync(quizId);
        if (quiz == null)
        {
            return NotFound();
        }
        if (quiz.InstructorId != userId)
        {
            return Forbid();
        }
        var questionEntity = new Question
        {
            Text = question.Text,
            ImageUrl = question.ImageUrl,
            Order = question.Order,
            QuizId = quizId, // come from the query parameter (the route)
            Answers = question.Answers.Select(a => new Answer
            {
                Text = a.Text,
                IsCorrect = a.IsCorrect
            }).ToList()
        };
        _context.Questions.Add(questionEntity);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetQuestion", new { id = questionEntity.Id }, questionEntity);
    }

    // DELETE: api/Question/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuestion(int? id)
    {
        var question = await _context.Questions.FindAsync(id);
        if (question == null)
        {
            return NotFound();
        }

        var quiz = await _context.Quizzes.FindAsync(question.QuizId);
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (quiz == null || quiz.InstructorId != userId)
            return Forbid();

        _context.Questions.Remove(question);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool QuestionExists(int? id)
    {
        return _context.Questions.Any(e => e.Id == id);
    }
}

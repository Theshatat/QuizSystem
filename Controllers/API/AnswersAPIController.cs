using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizSystem.Models;
using QuizSystem.Data;

[Route("api/[controller]")]
[ApiController]
public class AnswersAPIController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public AnswersAPIController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Answer
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Answer>>> GetAnswer()
    {
        return await _context.Answers.ToListAsync();
    }

    // GET: api/Answer/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Answer>> GetAnswer(int id)
    {
        var answer = await _context.Answers.FindAsync(id);

        if (answer == null)
        {
            return NotFound();
        }

        return answer;
    }

    // PUT: api/Answer/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAnswer(int? id, Answer answer)
    {
        if (id != answer.Id)
        {
            return BadRequest();
        }

        _context.Entry(answer).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AnswerExists(id))
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

    // POST: api/Answer
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Answer>> PostAnswer(Answer answer)
    {
        _context.Answers.Add(answer);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetAnswer", new { id = answer.Id }, answer);
    }

    // DELETE: api/Answer/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAnswer(int? id)
    {
        var answer = await _context.Answers.FindAsync(id);
        if (answer == null)
        {
            return NotFound();
        }

        _context.Answers.Remove(answer);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool AnswerExists(int? id)
    {
        return _context.Answers.Any(e => e.Id == id);
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using QuizSystem.Data;
using QuizSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace QuizSystem.Controllers
{
    public class QuizsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public QuizsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Quizs
        public async Task<IActionResult> Index()
        {
            var quizzes = await _context.Quizzes.ToListAsync();
            if (quizzes == null || !quizzes.Any())
            {
                return View(new List<Quiz>()); // Return an empty list if there are no quizzes
            }
            return View(quizzes);
        }

        // GET: Quizs/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var quiz = await _context.Quizzes
                .FirstOrDefaultAsync(m => m.Id == id);
            if (quiz == null)
            {
                return NotFound();
            }

            return View(quiz);
        }

        // GET: Quizs/Create
        [Authorize(Roles = "Admin")]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Quizs/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([Bind("Id,Title,Description,IsPublished,CreatedAt,DurationInMinutes")] Quiz quiz)
        {
            //ModelState.Remove("Id");
            if (ModelState.IsValid)
            {
                _context.Add(quiz);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(quiz);

        }

        // GET: Quizs/Edit/5
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null)
            {
                return NotFound();
            }
            return View(quiz);
        }

        // POST: Quizs/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Title,Description,IsPublished,CreatedAt,DurationInMinutes")] Quiz quiz)
        {
            if (id != quiz.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(quiz);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!QuizExists(quiz.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(quiz);
        }

        // GET: Quizs/Delete/5
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var quiz = await _context.Quizzes
                .FirstOrDefaultAsync(m => m.Id == id);
            if (quiz == null)
            {
                return NotFound();
            }

            return View(quiz);
        }

        // POST: Quizs/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz != null)
            {
                _context.Quizzes.Remove(quiz);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool QuizExists(int id)
        {
            return _context.Quizzes.Any(e => e.Id == id);
        }
        public async Task<IActionResult> TakeQuiz(int id)
        {
            // Load quiz with questions and answers
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null)
                return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(); // or redirect to login
            }
            var attempt = await _context.QuizAttempts
                .FirstOrDefaultAsync(a => a.QuizId == quiz.Id && a.UserId == userId);
            // Create a quiz attempt record when student starts

            if (attempt == null)
            {
                attempt = new QuizAttempt
                {
                    QuizId = quiz.Id,
                    StaretedAt = DateTime.Now,
                    UserId = userId,
                    TotalQuestions = quiz.Questions.Count,
                    Score = 0
                };

                _context.QuizAttempts.Add(attempt);
                await _context.SaveChangesAsync();
            }

            // Pass attempt Id to the view (hidden field)
            ViewBag.AttemptId = attempt.Id;

            return View(quiz);
        }

        [HttpPost]
        public async Task<IActionResult> SubmitQuiz(int QuizId, int AttemptId, Dictionary<int, int> Answers)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == QuizId);

            if (quiz == null)
                return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var attempt = await _context.QuizAttempts
                .FirstOrDefaultAsync(a => a.Id == AttemptId && a.QuizId == QuizId && a.UserId == userId);

            if (attempt == null)
                return NotFound();


            int score = 0;

            foreach (var question in quiz.Questions)
            {
                if (Answers.ContainsKey(question.Id))
                {
                    var selectedAnswerId = Answers[question.Id];
                    var correctAnswer = question.Answers.FirstOrDefault(a => a.IsCorrect);

                    if (correctAnswer != null && selectedAnswerId == correctAnswer.Id)
                        score++;
                }
            }
            attempt.StaretedAt = attempt.StaretedAt;
            attempt.Score = score;
            attempt.FinishedAt = DateTime.Now;
            attempt.TotalQuestions = attempt.TotalQuestions;

            _context.Update(attempt);
            await _context.SaveChangesAsync();

            return RedirectToAction("Result", new { attemptId = attempt.Id }); //attemptId here should be passed in the Result action as a parameter (case sensitive)
        }

        public async Task<IActionResult> Result(int attemptId)
        {
            var attempt = await _context.QuizAttempts
                .Include(a => a.Quiz)
                .FirstOrDefaultAsync(a => a.Id == attemptId);

            if (attempt == null) return NotFound();

            return View(attempt);
        }
    }
}

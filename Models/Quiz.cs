using QuizSystem.Data;
using System;
using System.Collections.Generic;

namespace QuizSystem.Models;

public partial class Quiz
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public bool IsPublished { get; set; }

    public DateTime CreatedAt { get; set; }

    public int DurationInMinutes { get; set; }

    public string? InstructorId { get; set; }

    public virtual ApplicationUser? Instructor { get; set; }

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();

    public virtual ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();
}

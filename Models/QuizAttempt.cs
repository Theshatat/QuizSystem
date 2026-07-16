using System;
using System.Collections.Generic;

namespace QuizSystem.Models;

public partial class QuizAttempt
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public DateTime StaretedAt { get; set; }

    public DateTime FinishedAt { get; set; }

    public int Score { get; set; }

    public int TotalQuestions { get; set; }

    public int QuizId { get; set; }

    public virtual ICollection<AttemptedAnswer> AttemptedAnswers { get; set; } = new List<AttemptedAnswer>();

    public virtual Quiz Quiz { get; set; } = null!;
}

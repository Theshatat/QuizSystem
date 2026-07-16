using System;
using System.Collections.Generic;

namespace QuizSystem.Models;

public partial class Answer
{
    public int Id { get; set; }

    public string Text { get; set; } = null!;

    public bool IsCorrect { get; set; }

    public int QuestionId { get; set; }

    public virtual ICollection<AttemptedAnswer> AttemptedAnswers { get; set; } = new List<AttemptedAnswer>();

    public virtual Question Question { get; set; } = null!;
}

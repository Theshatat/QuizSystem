using System;
using System.Collections.Generic;

namespace QuizSystem.Models;

public partial class Question
{
    public int Id { get; set; }

    public string Text { get; set; } = null!;

    public string? ImageUrl { get; set; }

    public int Order { get; set; }

    public int QuizId { get; set; }

    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();

    public virtual ICollection<AttemptedAnswer> AttemptedAnswers { get; set; } = new List<AttemptedAnswer>();

    public virtual Quiz Quiz { get; set; } = null!;
}

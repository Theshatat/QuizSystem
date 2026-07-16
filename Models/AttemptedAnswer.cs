using System;
using System.Collections.Generic;

namespace QuizSystem.Models;

public partial class AttemptedAnswer
{
    public int Id { get; set; }

    public int QuizAttemptId { get; set; }

    public int SelectedAnswerId { get; set; }

    public int QuestionId { get; set; }

    public virtual Question Question { get; set; } = null!;

    public virtual QuizAttempt QuizAttempt { get; set; } = null!;

    public virtual Answer SelectedAnswer { get; set; } = null!;
}

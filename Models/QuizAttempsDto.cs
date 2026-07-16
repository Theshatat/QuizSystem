namespace QuizSystem.Models
{
    public class QuizAttempsDto
    {
        public int Id { get; set; }
        public string QuizTitle { get; set; }
        public DateTime StaretedAt { get; set; }
        public DateTime FinishedAt { get; set; }
        public int Score { get; set; }
        public int TotalQuestions { get; set; }
        public List<QuestionResultDto> Questions { get; set; }
    }

    public class QuestionResultDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int? SelectedAnswerId { get; set; }
        public List<AnswerResultDto> Answers { get; set; }
    }

    public class AnswerResultDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }
}

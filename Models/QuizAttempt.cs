namespace QuizSystem.Models
{
    public class QuizAttempt
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public DateTime StaretedAt { get; set; }
        public DateTime FinishedAt { get; set; }
        public int Score { get; set; }
        public int TotalQuestions { get; set; }
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }
        public List<AttemptedAnswer> AttemptedAnswers { get; set; } = new();
    }
}

namespace QuizSystem.Models
{
    public class AttemptedAnswer
    {
        public int Id { get; set; }
        public int QuizAttemptId { get; set; }
        public int SelectedAnswerId { get; set; }
        public QuizAttempt QuizAttempt { get; set; }
        public int QuestionId { get; set; }
        public Question Question { get; set; }
        public Answer SelectedAnswer { get; set; }
    }
}
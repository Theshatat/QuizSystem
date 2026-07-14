namespace QuizSystem.Models
{
    public class SubmitQuizDto
    {
        public int QuizId { get; set; }

        public int AttemptId { get; set; }

        public Dictionary<int, int> Answers { get; set; } = [];
    }
}

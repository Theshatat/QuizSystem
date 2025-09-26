namespace QuizSystem.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string? ImageUrl { get; set; }
        public int Order { get; set; } // Position of the question in the quiz
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }
        public List<Answer> Answers { get; set; } = new();
    }
}
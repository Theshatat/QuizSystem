namespace QuizSystem.Models
{
    public class Quiz
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int DurationInMinutes { get; set; }
        public List<Question> Questions { get; set; } = new();
    }
}

using System.ComponentModel.DataAnnotations;

namespace QuizSystem.Models
{
    public class QuizDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int DurationInMinutes { get; set; }
        public List<QuestionDto> Questions { get; set; } = new();
    }

    public class QuestionDto
    {
        public string Text { get; set; }
        public string? ImageUrl { get; set; }
        public int Order { get; set; }
        public List<AnswerDto> Answers { get; set; } = new();
    }

    public class AnswerDto
    {
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }
}

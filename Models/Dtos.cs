namespace QuizSystem.Models
{
    public class AnswerForStudentDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
    }

    public class QuestionForStudentDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string? ImageUrl { get; set; }
        public List<AnswerForStudentDto> Answers { get; set; }
    }

    public class QuizForStudentDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int DurationInMinutes { get; set; }
        public List<QuestionForStudentDto> Questions { get; set; }
    }
}

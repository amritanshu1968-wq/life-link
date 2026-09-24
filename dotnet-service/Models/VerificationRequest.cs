namespace VerificationService.Models
{
    public enum VerificationStatus
    {
        Pending,
        Verified,
        Rejected,
        Suspended
    }

    public enum EntityType
    {
        Hospital,
        BloodBank,
        Donor
    }

    public class VerificationRecord
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        public string EntityName { get; set; } = string.Empty;
        public EntityType Type { get; set; }
        public VerificationStatus Status { get; set; } = VerificationStatus.Pending;
        public string DocumentUrl { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewedAt { get; set; }
    }
}

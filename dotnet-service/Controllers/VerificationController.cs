using Microsoft.AspNetCore.Mvc;
using VerificationService.Models;

namespace VerificationService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VerificationController : ControllerBase
    {
        private static readonly List<VerificationRecord> Verifications = new()
        {
            new VerificationRecord
            {
                Id = "VER-101",
                UserId = "user-hosp-1",
                EntityName = "Apex Super Speciality Hospital",
                Type = EntityType.Hospital,
                Status = VerificationStatus.Verified,
                Remarks = "State Medical Registration verified",
                ReviewedAt = DateTime.UtcNow.AddDays(-2)
            },
            new VerificationRecord
            {
                Id = "VER-102",
                UserId = "user-bank-1",
                EntityName = "Regional City Blood Bank & Reserve",
                Type = EntityType.BloodBank,
                Status = VerificationStatus.Verified,
                Remarks = "Drugs Standard Control Organization license verified",
                ReviewedAt = DateTime.UtcNow.AddDays(-1)
            }
        };

        [HttpGet]
        public ActionResult<IEnumerable<VerificationRecord>> GetAll()
        {
            return Ok(Verifications);
        }

        [HttpGet("{id}")]
        public ActionResult<VerificationRecord> GetById(string id)
        {
            var record = Verifications.FirstOrDefault(v => v.Id == id);
            if (record == null) return NotFound(new { success = false, message = "Record not found" });
            return Ok(record);
        }

        [HttpPost]
        public ActionResult<VerificationRecord> Submit([FromBody] VerificationRecord record)
        {
            record.Id = $"VER-{Random.Shared.Next(100, 999)}";
            record.SubmittedAt = DateTime.UtcNow;
            record.Status = VerificationStatus.Pending;
            Verifications.Add(record);
            return CreatedAtAction(nameof(GetById), new { id = record.Id }, record);
        }

        [HttpPut("{id}/status")]
        public ActionResult<VerificationRecord> UpdateStatus(string id, [FromBody] VerificationStatus status, [FromQuery] string remarks = "")
        {
            var record = Verifications.FirstOrDefault(v => v.Id == id);
            if (record == null) return NotFound(new { success = false, message = "Record not found" });

            record.Status = status;
            record.Remarks = remarks;
            record.ReviewedAt = DateTime.UtcNow;
            return Ok(record);
        }
    }
}

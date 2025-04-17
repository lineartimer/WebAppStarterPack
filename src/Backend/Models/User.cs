using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public partial class User
{
    [Key]
    public int Id { get; set; }

    public int RoleId { get; set; }

    [StringLength(64)]
    public string UserName { get; set; } = null!;

    [StringLength(128)]
    public string Password { get; set; } = null!;

    [StringLength(512)]
    public string Email { get; set; } = null!;

    [StringLength(64)]
    public string FirstName { get; set; } = null!;

    [StringLength(64)]
    public string? LastName { get; set; }

    [ForeignKey("RoleId")]
    [InverseProperty("Users")]
    public virtual Role Role { get; set; } = null!;
}

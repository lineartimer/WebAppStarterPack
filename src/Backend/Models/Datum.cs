using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public partial class Datum
{
    [Key]
    public int Id { get; set; }

    [StringLength(10)]
    public string? Col1 { get; set; }

    [StringLength(10)]
    public string? Col2 { get; set; }

    [StringLength(10)]
    public string? Col3 { get; set; }
}

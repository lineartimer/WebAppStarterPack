using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public partial class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options)
        : base(options)
    {

    }

    public virtual DbSet<Datum> Data { get; set; }
}

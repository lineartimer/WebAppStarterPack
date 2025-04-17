using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

public partial class DatabaseContext : DbContext
{

    public DatabaseContext(DbContextOptions<DatabaseContext> options)
        : base(options)
    {
        
    }

    public virtual DbSet<Datum> Data { get; set; }

    public virtual DbSet<User> Users { get; set; }
}

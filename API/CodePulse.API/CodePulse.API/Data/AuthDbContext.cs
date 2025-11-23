using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CodePulse.API.Data
{
    public class AuthDbContext : IdentityDbContext
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            var readerRoleId = "0f8fad5b-d9cb-469f-a165-70867728950e";
            var writerRoleId = "b32a6c89-1f4e-4d2b-9c7a-e5f81034d9b1";

            // Create Reader And Writer Roles
            var roles = new List<IdentityRole>
            {
                new IdentityRole()
                {
                    Id = readerRoleId,
                    Name = "Reader",
                    NormalizedName = "Reader".ToUpper(),
                    ConcurrencyStamp = readerRoleId
                },
                new IdentityRole()
                {
                    Id = writerRoleId,
                    Name = "Writer",
                    NormalizedName = "Writer".ToUpper(),
                    ConcurrencyStamp = writerRoleId
                }
            };

            // Seed Roles
            builder.Entity<IdentityRole>().HasData(roles);

            // Create Admin User
            var adminUserId = "54b0c9d7-8f3a-4c2e-9d6b-1a0f5e7c4b3d";
            var admin = new IdentityUser()
            {
                Id = adminUserId,
                UserName = "admin@codepulse.com",
                Email = "admin@codepulse.com",
                NormalizedEmail = "admin@codepulse.com".ToUpper(),
                NormalizedUserName = "admin@codepulse.com".ToUpper(),
                //Admin@123
                PasswordHash = "AQAAAAIAAYagAAAAEAINpqjYpi1dN+tdgY142eEGse7S4eXpmAMp5vzl+swF77ZIi9/UpBfrtqApfJNtbQ==",

                // FIX ADDED HERE:
                // These values must match what is in your 'InitialMigrationForAuth.cs' file
                SecurityStamp = "2106a3bf-988c-45c5-a2eb-c846b11b6c1a",
                ConcurrencyStamp = "2dfe0c43-7150-4317-a3fd-97e47ca5d2e0"
            };

            builder.Entity<IdentityUser>().HasData(admin);

            // Give Roles To Admin
            var adminRoles = new List<IdentityUserRole<string>>()
            {
                new()
                {
                    UserId = adminUserId,
                    RoleId = readerRoleId
                },
                new()
                {
                    UserId = adminUserId,
                    RoleId = writerRoleId
                }
            };

            builder.Entity<IdentityUserRole<string>>().HasData(adminRoles);
        }
    }
}
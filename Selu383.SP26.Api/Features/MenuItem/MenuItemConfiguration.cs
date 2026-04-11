using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Selu383.SP26.Api.Features.MenuItem;

namespace Selu383.SP26.Api.Features.MenuItem;

public class MenuItemConfiguration : IEntityTypeConfiguration<MenuItem>
{
 public void Configure(EntityTypeBuilder<MenuItem> builder)
    {
        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(120);

        builder.Property(x => x.Description)
            .HasMaxLength(500);

        builder.Property(x => x.Price)
            .HasColumnType("decimal(18,2)");
    }
}
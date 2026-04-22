namespace Selu383.SP26.Api.Features.Locations;

public class PickupTimeDto
{
    public string Label { get; set; } = string.Empty;
    public DateTime Time { get; set; }
    public bool IsAsap { get; set; }
}

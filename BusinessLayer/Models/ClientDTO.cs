namespace BusinessLayer.Models;

using System;

public class ClientDTO
{
    public Guid? Id { get; set; }

    public string Pin { get; set; }

    public string Name { get; set; }

    public string? Number { get; set; }

    public string? Email { get; set; }
}

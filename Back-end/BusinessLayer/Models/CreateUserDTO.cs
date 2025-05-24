namespace BusinessLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public class CreateUserDTO
{
    public string Username { get; set; }

    public byte? Role { get; set; }

    public string Password { get; set; }

    public string LoggedUser { get; set; }
}

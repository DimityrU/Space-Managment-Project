namespace BusinessLayer.Contracts;

using System.Collections.Generic;
using Models;

public class GetStatisticResponse : BaseResponse
{
    public IEnumerable<StatisticDTO> Statistic { get; set; } 
}

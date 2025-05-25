export class StatisticMapper
{
    MapStatistic(data)
    {
            const monthLabels = [
        'Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни',
        'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'
    ];

    return {
        labels: monthLabels,
        values: monthLabels.map((_, index) => {
            const stat = data.find(m => m.month === index + 1);
            return stat ? stat.bookedDays : 0;
        })
    };


    };

}
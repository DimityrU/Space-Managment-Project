import { GetParameter } from "./GetUrlParam.js";

export function checkForNewEntry(urlParam,objectProperty,array,urlParam2,objectProperty2) {
    //urlParam2 && objectProperty2 are optional
    let propertyValue = GetParameter(urlParam);
    let propertyValue2 =  urlParam2 ? GetParameter(urlParam2) : false;

    if (propertyValue && 
        array.find(x => x[objectProperty] == propertyValue 
        || (x[objectProperty]+"").includes(propertyValue+"")))
    {
        if(!propertyValue2)
        {
            array.sort((a, b) => (a[objectProperty] === propertyValue ? -1 : 0));
            return true;
        }

        else if(array.find((x) =>
        {
        return (x[objectProperty2] == propertyValue2 || (x[objectProperty2]+"").includes(propertyValue2+""));
        }))
        {
            array.sort((a, b) => (a[objectProperty] === propertyValue ? -1 : 0));
            return true;        
        }
    };
    return false;
};
  
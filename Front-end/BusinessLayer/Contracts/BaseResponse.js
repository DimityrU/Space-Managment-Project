export class BaseResponse
{
    constructor(data="")
    {
        this.data = data;
        this.error={errorMessage:"",hasError:false};
    }

    addError(message)
    {
        this.error.hasError=true;
        if(message)
        {
            this.error.errorMessage = message;
        }
    }
}
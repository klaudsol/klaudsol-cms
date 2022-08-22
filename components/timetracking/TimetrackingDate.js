class TimetrackingDate {
    constructor(){
        //
    }
    
    getLocalDate(){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); 
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        return dateTime;
      }

    getUTCDate(){
        var today = new Date();
        var date = today.getUTCFullYear()+'-'+(today.getUTCMonth()+1)+'-'+today.getUTCDate(); 
        var time = today.getUTCHours() + ":" + today.getUTCMinutes() + ":" + today.getUTCSeconds();
        var dateTime = date+' '+time;
        return dateTime;
      }

    convertUTC(date){
        const utcDate = new Date(date);
        const localdate = new Date(Date.UTC(
        utcDate.getFullYear(),
        utcDate.getMonth(),
        utcDate.getDate(),
        utcDate.getHours(),
        utcDate.getMinutes(),
        utcDate.getSeconds(),
        ));

        var convertedTime = localdate.toLocaleTimeString();
        var convertedDate = localdate.toDateString();
        if (convertedTime.toString() === "Invalid Date"){
          local_date_time = " ";
        } else {
          var local_date_time = convertedDate + ' ' + convertedTime;
        }
        return local_date_time;
      }
      
      convertUTCTime(date){
        const utcDate = new Date(date);
        const localdate = new Date(Date.UTC(
        utcDate.getFullYear(),
        utcDate.getMonth(),
        utcDate.getDate(),
        utcDate.getHours(),
        utcDate.getMinutes(),
        utcDate.getSeconds(),
        ));

        var convertedTime = localdate.toLocaleString();
        return convertedTime;
      }

       convertToUTC(date){
        var today = new Date(date);
        var date = today.getUTCFullYear()+'-'+(today.getUTCMonth()+1)+'-'+today.getUTCDate(); 
        var time = today.getUTCHours() + ":" + today.getUTCMinutes() + ":" + today.getUTCSeconds();
        var dateTime = date+' '+time;
        return dateTime;
      }
}   

export default TimetrackingDate;
import { Component, OnInit } from '@angular/core';
import { audit, first } from 'rxjs/operators';

import { Audit, User } from '@/_models';
import { AuditService, AuthenticationService } from '@/_services';
import { DatePipe } from '@angular/common';

@Component({ templateUrl: 'audit.component.html',providers: [DatePipe] })
export class AuditComponent implements OnInit
{
    audits = [];
    currentUser: User;
    p:number=1;
    selectedTimeSlot:any;
    setDob: any;
   
    constructor(
        private authenticationService: AuthenticationService,
        private auditService: AuditService,
        private datePipe: DatePipe,
    )
    {
    }

    ngOnInit()
    {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.loadAllAudits();
    }
   
    private loadAllAudits()
    {
        this.auditService.getAll()
            .pipe(first())
            .subscribe(audits => {
                if(audits){
                    audits.forEach(el=>{
                        if(el.loginTime){
                            var datePipe = new DatePipe('en-US');
                            this.setDob = datePipe.transform(el.loginTime, 'dd/MM/yyyy hh:mm:ss a');
                            el.loginTime=this.setDob;
                        }
                        if(el.logoutTime){
                            var datePipe = new DatePipe('en-US');
                            this.setDob = datePipe.transform(el.logoutTime, 'dd/MM/yyyy hh:mm:ss a');
                            el.logoutTime=this.setDob
                        }
                    })
                }
                this.audits = audits
              
            });
           
    }
    timeConvertion(s){
     
            var time = s.toLowerCase().split(':');
            var hours = parseInt(time[0]);
            var _ampm = time[2];
            if (_ampm.indexOf('am') != -1 && hours == 12) {
              time[0] = '00';
            }
            if (_ampm.indexOf('pm')  != -1 && hours < 12) {
              time[0] = hours + 12;
            }
            return time.join(':').replace(/(am|pm)/, '');
      }
  
    changeTimeFormate12to24(selectedTimeSlot){

         if(selectedTimeSlot=='24 hr Format'){
            this.audits.forEach(el=>{
             if(el.loginTime){
                var datePipe = new DatePipe('en-US');
                this.setDob = datePipe.transform(el.loginTime, 'dd/MM/yyyy hh:mm:ss a');        
                const getTime=this.setDob.split(' ');
                el.loginTime=getTime[0]+' '+this.timeConvertion(getTime[1]+getTime[2]);
               }  
            if(el.logoutTime){
                var datePipe = new DatePipe('en-US');
                this.setDob = datePipe.transform(el.logoutTime, 'dd/MM/yyyy hh:mm:ss a');        
                const getTime=this.setDob.split(' ');
                el.logoutTime=getTime[0]+' '+this.timeConvertion(getTime[1]+getTime[2]);
              }
             })
            
         }
     
    
}
}
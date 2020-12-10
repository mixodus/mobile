import { Injectable } from "@angular/core";
import { Resolve } from '@angular/router';
import { CertificationService } from './certification.service';

@Injectable()
export class CertificationResolver implements Resolve<any>{
    constructor(
        private certificationService: CertificationService
    ){}
    resolve(){
        return this.certificationService.getDataStore(true);
    }
    
}
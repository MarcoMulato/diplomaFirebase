import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  contacto: FormGroup;
  submitted = false;
  constructor(
    private firestorage: AngularFirestore,
    private storage: AngularFireStorage,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
          this.contacto = this.formBuilder.group({
              nombre: ['', Validators.required],            
              correo: ['', [Validators.required, Validators.email]],
              taller: ['', Validators.required],
              fecha: ['', Validators.required]
          });
      }

  get f() { return this.contacto.controls; }

  subir() {
    this.submitted = true;
 
    if (this.contacto.invalid) {
        return;
    }

    alert('Diploma enviado!')
    this.firestorage.collection('contacto').add(this.contacto.value)
  }
}

import {
  Component,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";
import { AuthService } from '../../service/auth.service'; // ✅ Importa el AuthService
import { AppSettings } from '../../service/app-settings.service';
import "lity";
import { ModalDirective } from "ngx-bootstrap/modal";

// 🔹 Datos en duro para simular usuarios con diferentes roles
const USUARIOS = [
  {
    username: "superadmin",
    nombre: "Super Administrador",
    avatar: "assets/img/empresa/avatar1.png",
    empresa: "Grupo TECA",
    logo: "assets/img/empresa/logo.png",
    rol: "administrador",
    password: "123456",
  },
  {
    username: "operador",
    nombre: "Leo Messi",
    avatar: "assets/img/empresa/avatar3.png",
    empresa: "Grupo VESTA",
    logo: "assets/img/empresa/vesta.png",
    rol: "operador",
    password: "012345",
  },
];

@Component({
  selector: "login",
  templateUrl: "./login.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./login.css"],
})
export class LoginPage implements OnDestroy {
  @ViewChild("childModal", { static: false }) childModal?: ModalDirective;

  submitted: boolean = false;
  rememberMe: boolean = false; // ✅ Nuevo checkbox para "Recordarme"

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(""),
    password: new FormControl(""),
  });

  constructor(
    private router: Router,
    private authService: AuthService, // ✅ Inyecta AuthService
    private formBuilder: FormBuilder,
    private appSettings: AppSettings // 👉 Inyectar AppSettings
  ) {
    this.appSettings.appEmpty = true; // 👉 Pantalla limpia sin layout
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required, Validators.minLength(4)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });

    // ✅ Si ya hay un usuario autenticado, redirigir a home
    if (this.authService.isAuthenticated()) {
      this.router.navigate(["/home"]);
    }
  }

  ngOnDestroy() {
    this.appSettings.appEmpty = false; // 👉 Cuando salgas del login, volver al layout normal

  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    // 🔍 Buscar el usuario en la lista de datos en duro
    const usuarioEncontrado = USUARIOS.find(
      (user) => user.username === username && user.password === password
    );

    if (usuarioEncontrado) {
      console.log("✅ Inicio de sesión exitoso. Redirigiendo...");

      // ✅ Guardar usuario en el AuthService (usa sessionStorage/localStorage)
      this.authService.setUser(usuarioEncontrado, this.rememberMe);

      this.router.navigate(["/home"]);
    } else {
      console.log("❌ Usuario o contraseña incorrectos");
    }
  }

  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  showChildModal(): void {
    this.childModal?.show();
  }

  hideChildModal(): void {
    this.childModal?.hide();
  }

  
  // #####################################

       scrollToTarget(targetId: string) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const scrollPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: scrollPosition, behavior: "smooth" });
    }
  }


}



/* import {
  Component,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";
import { AppSettings } from "../../core/service/app-settings.service";
import "lity";
import { ModalDirective } from "ngx-bootstrap/modal";
import { AuthService } from '../../core/service/auth.service';


@Component({
  selector: "login",
  templateUrl: "./login.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./login.css"],
})
export class LoginPage implements OnDestroy {
  @ViewChild("childModal", { static: false }) childModal?: ModalDirective;

  sigaUsuario: string = "";
  submitted: boolean;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(""),
    password: new FormControl(""),
  });

  constructor(
    private router: Router,
    public appSettings: AppSettings,
    private formBuilder: FormBuilder
  ) {
    this.appSettings.appEmpty = true;
    this.submitted = false;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required, Validators.minLength(6)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnDestroy() {
    this.appSettings.appEmpty = false;
  }

 // onSubmit(): void {
 //   this.submitted = true;

 //   if (this.loginForm.invalid) {
 //     return;
 //   }

 //   console.log(JSON.stringify(this.loginForm.value, null, 2));
 // }

 onSubmit(): void {
  this.submitted = true;

  if (this.loginForm.invalid) {
    return;
  }

  // Usuario y contraseña en duro
  const usuarioFijo = "superadmin";
  const passwordFijo = "123456";

  const { username, password } = this.loginForm.value;

  if (username === usuarioFijo && password === passwordFijo) {
    console.log("Inicio de sesión exitoso. Redirigiendo...");
    this.router.navigate(["/home"]); // Redirige a home
  } else {
    console.log("Usuario o contraseña incorrectos");
  }
}


  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }



  // #####################################

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  scrollToTarget(targetId: string) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const scrollPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: scrollPosition, behavior: "smooth" });
    }
  }

  showChildModal(): void {
    this.childModal?.show();
  }

  hideChildModal(): void {
    this.childModal?.hide();
  }

} */

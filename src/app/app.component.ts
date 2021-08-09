import { Component, OnInit } from '@angular/core';
import { PlaneteService } from './services/planete/planete.service';
import { JoueurService } from './services/joueur/joueur.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'spaceMiner';
  canvas: any;
  ctx: any;
  raf: number;



  private vaisseauMain = {
    x: 380,
    y: 240,
    height: 100,
    width: 100,
    img: this.getImg(),
    draw(that) {
      that.ctx.drawImage(this.img, this.x, this.y, this.height, this.width);
    }
  }



  constructor(public planeteService: PlaneteService, public joueurService: JoueurService) { }


  ngOnInit() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Planetes
    this.planeteService.liste.map(planet => planet.draw(this))

    // Vaisseau mère
    this.vaisseauMain.draw(this)

    // Fin de boucle
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }



  public click_canvas($e){
    this.planeteService.select($e.offsetX, $e.offsetY)
  }

  getImg() {
    let img = new Image();
    img.src = "assets/Vaisseau/1.png";
    return img
  }
  
}

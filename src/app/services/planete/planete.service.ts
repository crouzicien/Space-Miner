import { Injectable } from '@angular/core';
import { JoueurService } from '../joueur/joueur.service';

@Injectable({
  providedIn: 'root'
})
export class PlaneteService {
  public current : Planet = null;
  public liste : Planet[] = [];

  public mars: Planet;
  public venus: Planet;
  public jupiter: Planet;

  constructor(joueurService: JoueurService) {
    this.liste.push(new Planet('mars', 600, 400, 50, 50, 1, 0.7, -18, 45, joueurService))
    this.liste.push( new Planet('venus', 300, 400, 60, 60, 0.72, 1, 12, 77, joueurService))
    this.liste.push(new Planet('jupiter', 200, 120, 90, 90, 1, 0.68, 45, -19, joueurService))
  }

  public select(x, y){
    let finded = false
    this.liste.map(planet => {
      if(x > planet.x && x <( planet.x+planet.width) && y > planet.y && y <( planet.y+planet.height)){
        this.current = planet
        finded = true
        return
      }
    })
    if(!finded) this.current = null
    
  }
}




class Planet {
  img = this.getImg()
  minageInProgess = false
  levels: any = {
    mineRate: {
      level: 1,
      value: (0.25 + (0.1) * (1 - 1) + (0.017) * Math.pow(1 - 1, 2)).toFixed(2),
      price() {
        return this.level * 65
      },
      update() {
        if (this.joueurService().credit < this.price() && !this.joueurService().devMode) return
        this.joueurService().credit -= this.price()
        this.level++
        this.value = (0.25 + (0.1) * (this.level - 1) + (0.017) * Math.pow(this.level - 1, 2)).toFixed(2)
      },
      joueurService: () => { return this.joueurService }

    },
    speedShip: {
      level: 1,
      value: (1 + 0.2 * (1 - 1) + (1 / 75) * Math.pow(1 - 1, 2)).toFixed(2),
      price() {
        return this.level * 65
      },
      update() {
        if (this.joueurService().credit < this.price() && !this.joueurService().devMode) return
        this.joueurService().credit -= this.price()
        this.level++
        this.value = (1 + 0.2 * (this.level - 1) + (1 / 75) * Math.pow(this.level - 1, 2)).toFixed(2)
      },
      joueurService: () => { return this.joueurService }

    },
    cargo: {
      level: 1,
      value: (5.1 + 2 * (1 - 1) + 0.1 * Math.pow(1 - 1, 2)).toFixed(0),
      price() {
        return this.level * 65
      },
      update() {
        if (this.joueurService().credit < this.price() && !this.joueurService().devMode) return
        this.joueurService().credit -= this.price()
        this.level++
        this.value = (5.1 + 2 * (this.level - 1) + 0.1 * Math.pow(this.level - 1, 2)).toFixed(0)
      },
      joueurService: () => { return this.joueurService }

    },
  }
  ressources = [
    {
      type: 'bronze',
      percent: 80,
      mined: 0,
      minedInt: 0,
    },
    {
      type: 'fer',
      percent: 20,
      mined: 0,
      minedInt: 0,
    }
  ]
  vaisseau = {
    img: this.getVaisseau(),
    direction: 'vaisseau',
    x: 605,
    y: 405,
    height: 30,
    width: 30,
    vX: 1,
    vY: 0.7,
    angleAlle: -15,
    angleRetour: 45,
    // space: 20,
    used: 0,
    ressources: [
      {
        type: 'bronze',
        qte: 0
      },
      {
        type: 'fer',
        qte: 0
      }
    ]
  }

  constructor(
    public name,
    public x,
    public y,
    public height,
    public width,
    vX,
    vY,
    angleAlle,
    angleRetour,
    private joueurService: JoueurService
  ) {
    // Centrage du vaisseau sur la planet
    this.vaisseau.x = x + (width / 2) - (this.vaisseau.width / 2)
    this.vaisseau.y = y + (height / 2) - (this.vaisseau.height / 2)
    // Affectation de la direction au vaisseau
    this.vaisseau.vX = vX
    this.vaisseau.vY = vY
    this.vaisseau.angleAlle = angleAlle
    this.vaisseau.angleRetour = angleRetour
  }

  getImg() {
    let img = new Image();
    img.src = "assets/Planets/" + this.name + ".png";
    return img
  }
  getVaisseau() {
    let img = new Image();
    img.src = "assets/Vaisseau/petit.png";
    return img
  }
  minage() {
    this.ressources.map(ressource => {
      ressource.minedInt += ressource.percent * ((1 * this.levels.mineRate.value) / 60) / 100
      ressource.mined = Math.round(ressource.minedInt)
    })
  }

  mineRateGlobal() {
    let total = 0
    this.ressources.map(res => {
      total += (this.levels.mineRate.value * res.percent / 100)
    })
    return total
  }

  draw(that) {
    that.ctx.drawImage(this.img, this.x, this.y, this.height, this.width);
    that.ctx.save();
    that.ctx.translate(this.vaisseau.x + (this.vaisseau.width / 2), this.vaisseau.y + (this.vaisseau.height / 2));
    if (this.vaisseau.direction == 'vaisseau') that.ctx.rotate(this.vaisseau.angleAlle * Math.PI / 64);
    if (this.vaisseau.direction == 'planete') that.ctx.rotate(this.vaisseau.angleRetour * Math.PI / 64);
    that.ctx.drawImage(this.vaisseau.img, -this.vaisseau.width / 2, -this.vaisseau.height / 2, this.vaisseau.height, this.vaisseau.width);
    that.ctx.restore()

    this.minage()
    this.move(that)
  }
  move(that) {
    let xFin, yFin

    if (this.vaisseau.direction == 'vaisseau') {
      /**
       * Déplacement
       */
      // Si la planete est a droite du vaisseau
      if (this.x > that.vaisseauMain.x) {
        // Deplacement x
        if ((this.vaisseau.x + (this.vaisseau.width / 2)) > (that.vaisseauMain.x + (that.vaisseauMain.width) / 2)) this.vaisseau.x -= this.vaisseau.vX * this.levels.speedShip.value
        else xFin = true
      }
      else {
        // Deplacement x
        if ((this.vaisseau.x + (this.vaisseau.width / 2)) < (that.vaisseauMain.x + (that.vaisseauMain.width) / 2)) this.vaisseau.x += this.vaisseau.vX * this.levels.speedShip.value
        else xFin = true
      }

      // Si la planete est en dessous du vaisseau
      if (this.y > that.vaisseauMain.y) {
        // Deplacement y
        if ((this.vaisseau.y + (this.vaisseau.width / 2)) > (that.vaisseauMain.y + (that.vaisseauMain.width) / 2)) this.vaisseau.y -= this.vaisseau.vY * this.levels.speedShip.value
        else yFin = true
      }
      else {
        // Deplacement y
        if ((this.vaisseau.y + (this.vaisseau.width / 2)) < (that.vaisseauMain.y + (that.vaisseauMain.width) / 2)) this.vaisseau.y += this.vaisseau.vY * this.levels.speedShip.value
        else yFin = true
      }

      /**
       * Arrivée au vaisseau
       */
      if (xFin && yFin) {
        this.dechargement()
        this.vaisseau.direction = 'planete'
      }
    }

    else if (this.vaisseau.direction == 'planete') {
      /**
       * Déplacement
       */
      // Si la planete est a droite du vaisseau
      if (this.x > that.vaisseauMain.x) {
        // Deplacement x
        if ((this.vaisseau.x + (this.vaisseau.width / 2)) < (this.x + (this.width) / 2)) this.vaisseau.x += this.vaisseau.vX * this.levels.speedShip.value
        else xFin = true
      }
      else {
        // Deplacement x
        if ((this.vaisseau.x + (this.vaisseau.width / 2)) > (this.x + (this.width) / 2)) this.vaisseau.x -= this.vaisseau.vX * this.levels.speedShip.value
        else xFin = true
      }

      // Si la planete est en dessous du vaisseau
      if (this.y > that.vaisseauMain.y) {
        // Deplacement y
        if ((this.vaisseau.y + (this.vaisseau.width / 2)) < (this.y + (this.width) / 2)) this.vaisseau.y += this.vaisseau.vY * this.levels.speedShip.value
        else yFin = true
      }
      else {
        // Deplacement y
        if ((this.vaisseau.y + (this.vaisseau.width / 2)) > (this.y + (this.width) / 2)) this.vaisseau.y -= this.vaisseau.vY * this.levels.speedShip.value
        else yFin = true
      }

      /**
       * Arrivée au vaisseau
       */
      if (xFin && yFin) {
        this.chargement()
        this.vaisseau.direction = 'vaisseau'
      }


    }

  }

  dechargement() {
    // Déchargement
    this.vaisseau.ressources.map(ressource => {
      let ressourceJoueur = this.joueurService.ressources.find(rec => rec.type == ressource.type)
      // Si auto sell > vend direct
      if (ressourceJoueur.autoSell) {
        this.joueurService.vente.sell(ressource)
      }
      // Sinon on fou dans le coffre joueur
      else {
        ressourceJoueur.qte += ressource.qte
      }

      ressource.qte = 0


    })
    this.vaisseau.used = 0
  }

  chargement() {
    for (let i = 0; i < this.levels.cargo.value; i++) {
      this.ressources.map(ress => {
        var d = Math.random();
        if (d < (ress.percent / 100)) {
          if (ress.minedInt >= 1) {

            let emplacementVaisseau = this.vaisseau.ressources.find(x => x.type == ress.type)
            emplacementVaisseau.qte += 1
            this.vaisseau.used += 1
            ress.minedInt -= 1

          }
        }
      })
    }
  }
}

class Vampire {
  constructor(name, yearConverted) {
    this.name = name;
    this.yearConverted = yearConverted;
    this.offspring = [];
    this.creator = null;
  }

  /** Simple tree methods **/

  // Adds the vampire as an offspring of this vampire
  addOffspring(vampire) {
    this.offspring.push(vampire);
    vampire.creator = this;
  }

  // Returns the total number of vampires created by that vampire
  get numberOfOffspring() {
    return this.offspring.length;
  }

  // Returns the number of vampires away from the original vampire this vampire is
  get numberOfVampiresFromOriginal() {
    let vampireParentCounter = 0;
    let currentVampire = this
    while (currentVampire.creator) {
      currentVampire = currentVampire.creator;
      vampireParentCounter++
    }
    return vampireParentCounter;
  }

  // Returns true if this vampire is more senior than the other vampire. (Who is closer to the original vampire)
  isMoreSeniorThan(vampire) {
    const thisVampireGeneration = this.numberOfVampiresFromOriginal;
    const vampireToCompare = vampire.numberOfVampiresFromOriginal;

    return thisVampireGeneration < vampireToCompare;
  }

  /** Tree traversal methods **/

  // Returns the vampire object with that name, or null if no vampire exists with that name
  vampireWithName(name) {

    if (this.name === name) {
      return this
    }

    for (const offspring of this.offspring) {
      const offspringCheck = offspring.vampireWithName(name)
      if (offspringCheck) { //offspringCheck will either be null (falsey) or the found name (from line 46). So there is no need to check if offspringCheck.name === name
        return offspringCheck
      }
    }

    return null
  }

  // Returns the total number of vampires that exist
  get totalDescendents() {
    let descendents = 0;
    for (const eachDescendent of this.offspring) {
      descendents++
      const furtherDescendents = eachDescendent.totalDescendents
      descendents += furtherDescendents
    }

    return descendents;
  }

  // Returns an array of all the vampires that were converted after 1980
  get allMillennialVampires() {
    let millenials = [];
    for (const eachOffspring of this.offspring) {
      if (eachOffspring.yearConverted >= 1980) {
        millenials.push(eachOffspring)
      }
      
      if (eachOffspring.offspring.length > 0) {
        millenials = millenials.concat(eachOffspring.allMillennialVampires)
      }
    }

    return millenials
  }


  /** Stretch **/

  // Returns the closest common ancestor of two vampires.
  // The closest common anscestor should be the more senior vampire if a direct ancestor is used.
  // For example:
  // * when comparing Ansel and Sarah, Ansel is the closest common anscestor.
  // * when comparing Ansel and Andrew, Ansel is the closest common anscestor.
  closestCommonAncestor(vampire) {
    const mostSenior = this.isMoreSeniorThan(vampire) ? this : vampire;
    const leastSenior = mostSenior === this ? vampire : this; 

    //Quick checks to see if the root vampire is involved (root vampire has no creator)
    if (!this.creator) return this
    if (!vampire.creator) return vampire

    //Quick check to see if the vampires compared are the same
    if (this === vampire) return this

    //Quick check to see if the most senior vampire is the direct ancestor of the least senior vampire
    if (mostSenior.offspring.includes(leastSenior)) return mostSenior

    const ancestorList = function(targetVampire) {
      let currentVampire = targetVampire;
      let listArray = [];

      while(currentVampire.creator) {
        listArray.push(currentVampire.creator);
        currentVampire = currentVampire.creator
      }
      return listArray
    }
    const mostSeniorAncestors = ancestorList(mostSenior);
    const leastSeniorAncestors = ancestorList(leastSenior);

    for (const eachVampire of mostSeniorAncestors) {
      if (leastSeniorAncestors.includes(eachVampire)) return eachVampire
    }
    
  }

}

module.exports = Vampire;


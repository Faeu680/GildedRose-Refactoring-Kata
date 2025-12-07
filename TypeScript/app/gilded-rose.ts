export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name: string, sellIn: number, quality: number) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  private static readonly AGED_BRIE = 'Aged Brie';
  private static readonly BACKSTAGE_PASS = 'Backstage passes to a TAFKAL80ETC concert';
  private static readonly SULFURAS = 'Sulfuras, Hand of Ragnaros';

  constructor(private readonly items: Item[] = []) {}

  public updateQuality(): Item[] {
    for (const item of this.items) {
      this.updateItem(item);
    }

    return this.items;
  }

  private updateItem(item: Item): void {
    if (this.isLegendary(item)) {
      // "Sulfuras" nunca altera qualidade nem sellIn
      return;
    }

    this.updateQualityBeforeSellIn(item);
    this.decreaseSellIn(item);
    this.updateQualityAfterSellIn(item);
  }

  // --- Regras antes da data de venda ---

  private updateQualityBeforeSellIn(item: Item): void {
    if (this.isAgedBrie(item)) {
      this.increaseQuality(item);
      return;
    }

    if (this.isBackstagePass(item)) {
      this.handleBackstageBeforeSellIn(item);
      return;
    }

    // item comum
    this.decreaseQuality(item);
  }

  private handleBackstageBeforeSellIn(item: Item): void {
    this.increaseQuality(item);

    if (item.sellIn < 11) {
      this.increaseQuality(item);
    }

    if (item.sellIn < 6) {
      this.increaseQuality(item);
    }
  }

  // --- Regras após a data de venda (sellIn < 0 após decremento) ---

  private updateQualityAfterSellIn(item: Item): void {
    if (item.sellIn >= 0) {
      return;
    }

    if (this.isAgedBrie(item)) {
      this.increaseQuality(item);
      return;
    }

    if (this.isBackstagePass(item)) {
      // Após o show, o valor cai para zero
      item.quality = 0;
      return;
    }

    // item comum após expirar degrada novamente
    this.decreaseQuality(item);
  }

  // --- Helpers de domínio ---

  private increaseQuality(item: Item): void {
    if (item.quality < 50) {
      item.quality += 1;
    }
  }

  private decreaseQuality(item: Item): void {
    if (item.quality > 0) {
      item.quality -= 1;
    }
  }

  private decreaseSellIn(item: Item): void {
    item.sellIn -= 1;
  }

  private isAgedBrie(item: Item): boolean {
    return item.name === GildedRose.AGED_BRIE;
  }

  private isBackstagePass(item: Item): boolean {
    return item.name === GildedRose.BACKSTAGE_PASS;
  }

  private isLegendary(item: Item): boolean {
    return item.name === GildedRose.SULFURAS;
  }
}
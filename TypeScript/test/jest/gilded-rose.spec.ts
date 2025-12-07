import { GildedRose, Item } from '@/gilded-rose';

describe('GildedRose', () => {
  it('deve diminuir quality e sellIn de um item comum antes da data de venda', () => {
    const items = [new Item('foo', 10, 20)];
    const gildedRose = new GildedRose(items);

    const updated = gildedRose.updateQuality();

    expect(updated[0].sellIn).toBe(9);
    expect(updated[0].quality).toBe(19);
  });

  it('não deve deixar quality de item comum ficar negativa', () => {
    const items = [new Item('foo', 5, 0)];
    const gildedRose = new GildedRose(items);

    const updated = gildedRose.updateQuality();

    expect(updated[0].sellIn).toBe(4);
    expect(updated[0].quality).toBe(0);
  });

  it('deve degradar quality de item comum duas vezes mais rápido após a data de venda', () => {
    const items = [new Item('foo', 0, 10)];
    const gildedRose = new GildedRose(items);

    const updated = gildedRose.updateQuality();

    expect(updated[0].sellIn).toBe(-1);
    expect(updated[0].quality).toBe(8);
  });

  it('Aged Brie deve aumentar quality enquanto se aproxima da data de venda', () => {
    const items = [new Item('Aged Brie', 5, 10)];
    const gildedRose = new GildedRose(items);

    const updated = gildedRose.updateQuality();

    expect(updated[0].sellIn).toBe(4);
    expect(updated[0].quality).toBe(11);
  });

  it('Aged Brie deve aumentar quality mais uma vez após expirar, sem ultrapassar 50', () => {
    const items = [new Item('Aged Brie', 0, 49)];
    const gildedRose = new GildedRose(items);

    const updated = gildedRose.updateQuality();

    expect(updated[0].sellIn).toBe(-1);
    // +1 antes de expirar, +1 depois de expirar, mas travado em 50
    expect(updated[0].quality).toBe(50);
  });

  it('Aged Brie não deve ultrapassar quality 50 mesmo após múltiplas atualizações', () => {
    const items = [new Item('Aged Brie', 5, 50)];
    const gildedRose = new GildedRose(items);

    const updated = gildedRose.updateQuality();

    expect(updated[0].sellIn).toBe(4);
    expect(updated[0].quality).toBe(50);
  });

  it('Backstage passes deve aumentar quality em 1 quando faltam mais de 10 dias', () => {
    const items = [new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20)];
    const gildedRose = new GildedRose(items);

    const updated = gildedRose.updateQuality();

    expect(updated[0].sellIn).toBe(14);
    expect(updated[0].quality).toBe(21);
  });

  it('Backstage passes deve aumentar quality em 1 quando faltam exatamente 11 dias', () => {
    const items = [new Item('Backstage passes to a TAFKAL80ETC concert', 11, 20)];
    const gildedRose = new GildedRose(items);

    const updated = gildedRose.updateQuality();

    expect(updated[0].sellIn).toBe(10);
    expect(updated[0].quality).toBe(21);
  });

  it('Backstage passes deve aumentar quality em 2 quando faltam entre 6 e 10 dias', () => {
    const items = [new Item('Backstage passes to a TAFKAL80ETC concert', 10, 20)];
    const gildedRose = new GildedRose(items);

    const updated = gildedRose.updateQuality();

    expect(updated[0].sellIn).toBe(9);
    expect(updated[0].quality).toBe(22);
  });

  it('Backstage passes deve aumentar quality em 2 quando faltam exatamente 6 dias', () => {
    const items = [new Item('Backstage passes to a TAFKAL80ETC concert', 6, 20)];
    const gildedRose = new GildedRose(items);

    const updated = gildedRose.updateQuality();

    expect(updated[0].sellIn).toBe(5);
    expect(updated[0].quality).toBe(22);
  });

  it('Backstage passes deve aumentar quality em 3 quando faltam 5 dias ou menos', () => {
    const items = [new Item('Backstage passes to a TAFKAL80ETC concert', 5, 20)];
    const gildedRose = new GildedRose(items);

    const updated = gildedRose.updateQuality();

    expect(updated[0].sellIn).toBe(4);
    expect(updated[0].quality).toBe(23);
  });

  it('Backstage passes não deve ultrapassar quality 50 mesmo com múltiplos incrementos', () => {
    const items = [new Item('Backstage passes to a TAFKAL80ETC concert', 5, 49)];
    const gildedRose = new GildedRose(items);

    const updated = gildedRose.updateQuality();

    expect(updated[0].sellIn).toBe(4);
    expect(updated[0].quality).toBe(50);
  });

  it('Backstage passes deve ter quality igual a 0 após o show', () => {
    const items = [new Item('Backstage passes to a TAFKAL80ETC concert', 0, 30)];
    const gildedRose = new GildedRose(items);

    const updated = gildedRose.updateQuality();

    expect(updated[0].sellIn).toBe(-1);
    expect(updated[0].quality).toBe(0);
  });

  it('Sulfuras não deve alterar quality nem sellIn', () => {
    const items = [new Item('Sulfuras, Hand of Ragnaros', 0, 80)];
    const gildedRose = new GildedRose(items);

    const updated = gildedRose.updateQuality();

    expect(updated[0].sellIn).toBe(0);
    expect(updated[0].quality).toBe(80);
  });

  it('deve retornar array vazio quando inicializado sem itens', () => {
    const gildedRose = new GildedRose();
    const updated = gildedRose.updateQuality();
    expect(updated).toEqual([]);
  });

  it('deve atualizar múltiplos itens corretamente de uma vez', () => {
    const items = [
      new Item('foo', 5, 10),
      new Item('Aged Brie', 2, 0),
      new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
      new Item('Sulfuras, Hand of Ragnaros', 0, 80),
    ];
    const gildedRose = new GildedRose(items);

    const updated = gildedRose.updateQuality();

    expect(updated).toHaveLength(4);

    expect(updated[0].sellIn).toBe(4);
    expect(updated[0].quality).toBe(9);

    expect(updated[1].sellIn).toBe(1);
    expect(updated[1].quality).toBe(1);

    expect(updated[2].sellIn).toBe(14);
    expect(updated[2].quality).toBe(21);

    expect(updated[3].sellIn).toBe(0);
    expect(updated[3].quality).toBe(80);
  });
});

const Urn = require('js-random-urn-draw');
const StickerService = require('./sticker-service');

export const draw_service = () =>
{
    // setting config for the urn
    let total_stickers = 100;
    // probability of each sticker
    const probabilities = {
        bronze: 0.85,
        silver: 0.125,
        gold: 0.025
    };
    
    // check if there is enough bronze
    if(StickerService.get_bronze_count() < (total_stickers * probabilities.bronze))
    {
        total_stickers = (Math.floor(StickerService.get_bronze_count() / 10) * 10);
    }
    
    // draw the bronze stickers
    const unr1 = new Urn(StickerService.get_bronze_stickers(), false);
    const bronze_stickers = unr1.draw( Math.floor(total_stickers * probabilities.bronze) );
    
    // draw the silver stickers
    const unr2 = new Urn(StickerService.get_silver_stickers(), false);
    const silver_stickers = unr2.draw( Math.floor(total_stickers * probabilities.silver) );
    
    // draw the gold stickers
    const unr3 = new Urn(StickerService.get_gold_stickers(), false);
    const gold_stickers = unr3.draw( Math.floor(total_stickers * probabilities.gold) );
    
    // combine the stickers
    const stickers_to_draw = bronze_stickers.concat(silver_stickers).concat(gold_stickers);
    
    // draw only 3 stickers from this array
    const final_draw = new Urn(stickers_to_draw, false);
    const final_stickers = final_draw.draw(3);
    
    // the final stickers
    console.log(final_stickers, total_stickers);

    return final_stickers;
}

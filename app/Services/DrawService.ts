const Urn = require('js-random-urn-draw');
import { Sticker, get_all_stickers } from './StickerService';

type probabilities = {
    bronze: number,
    silver: number,
    gold: number,
};

const esmerald = {
    bronze: 0.85,
    silver: 0.125,
    gold: 0.025
};
const obsidian = {
    bronze: 0.775,
    silver: 0.175,
    gold: 0.05
};
const diamond = {
    bronze: 0.7,
    silver: 0.225,
    gold: 0.075
};

const get_probabilities = (package_type: 1|2|3): probabilities =>
{
    switch(package_type)
    {
        case 1:
            return esmerald;
        case 2:
            return obsidian;
        case 3:
            return diamond;
        default:
            return esmerald;
    }
};

export const draw_service = async (pack_type: 1|2|3) =>
{
    // setting config for the urn
    let total_stickers = 100;
    // probability of each sticker
    const probabilities = get_probabilities(pack_type);

    let all_stickers_available:any = await get_all_stickers();
    let available_bronze_stickers = all_stickers_available.bronze;
    let available_silver_stickers:any[] = all_stickers_available.silver;
    let available_gold_stickers:any[] = all_stickers_available.gold;
    
    // check if there is enough bronze
    if(available_bronze_stickers.length < (total_stickers * probabilities.bronze))
    {
        total_stickers = (Math.floor(available_bronze_stickers.length / 10) * 10);
    }
    
    // draw the bronze stickers
    const unr1 = new Urn(available_bronze_stickers, false);
    const bronze_stickers = unr1.draw( Math.floor(total_stickers * probabilities.bronze) );
    
    // draw the silver stickers
    const unr2 = new Urn(available_silver_stickers, false);
    const silver_stickers = unr2.draw( Math.floor(total_stickers * probabilities.silver) );
    
    // draw the gold stickers
    const unr3 = new Urn(available_gold_stickers, false);
    const gold_stickers = unr3.draw( Math.floor(total_stickers * probabilities.gold) );
    
    // combine the stickers
    const stickers_to_draw = bronze_stickers.concat(silver_stickers).concat(gold_stickers);
    
    // draw only 3 stickers from this array
    const final_draw = new Urn(stickers_to_draw, false);
    const final_stickers: Sticker[] = final_draw.draw(3);

    return final_stickers;
}

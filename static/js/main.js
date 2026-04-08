import Swup from 'swup';
import SwupPreloadPlugin from '@swup/preload-plugin';

const swup = new Swup({
    containers: ['#swup', '#main-nav'],
    plugins: [new SwupPreloadPlugin()]
});

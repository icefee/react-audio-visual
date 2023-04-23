/**
 * @type {import('rollup').RollupOptions}
 */

import typescript from '@rollup/plugin-typescript';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: {
        index: 'src/lib/index.tsx'
    },
    output: {
        dir: 'dist',
        format: 'es'
    },
    plugins: [
        typescript(),
        resolve(),
        commonjs(),
        babel({
            comments: false,
            runtimeHelpers: true,
            extensions: ['.ts', '.tsx'],
            presets: [
                '@babel/preset-react',
                [
                    '@babel/preset-env',
                    {
                        targets: { browsers: ['last 2 versions', 'safari >= 7'] }
                    }
                ]
            ],
            plugins: [
                ['@babel/transform-runtime', { useESModules: true, regenerator: false }]
            ],
            exclude: 'node_modules/**'
        })
    ],
    external: [
        'react',
        'react-dom'
    ]
}

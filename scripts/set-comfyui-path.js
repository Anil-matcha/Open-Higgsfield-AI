const path = require('path');

const {
    getComfyUiConfigFile,
    getDefaultUserDataDir,
    normalizeComfyUiPath,
    readComfyUiConfig,
    resolveComfyUiPath,
    writeComfyUiConfig,
} = require('../electron/lib/comfyUiConfig');

function parseArgs(argv) {
    const args = { comfyUiPath: '', dataDir: '', clear: false };
    const rest = [...argv];

    while (rest.length > 0) {
        const current = rest.shift();
        if (current === '--data-dir') {
            args.dataDir = rest.shift() || '';
            continue;
        }
        if (current === '--clear') {
            args.clear = true;
            continue;
        }
        if (!args.comfyUiPath) {
            args.comfyUiPath = current;
        }
    }

    return args;
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    const dataDir = args.dataDir || path.join(
        getDefaultUserDataDir({ platform: process.platform }),
        'local-ai'
    );
    const configFile = getComfyUiConfigFile({
        dataDir,
        platform: process.platform,
    });

    if (args.clear) {
        writeComfyUiConfig({ configFile, config: { path: '' } });
    } else if (args.comfyUiPath) {
        writeComfyUiConfig({
            configFile,
            config: { path: normalizeComfyUiPath(args.comfyUiPath) },
        });
    }

    const storedConfig = readComfyUiConfig({ configFile });
    const resolvedPath = resolveComfyUiPath({
        config: storedConfig,
        env: process.env,
        platform: process.platform,
    });

    console.log(JSON.stringify({
        configFile,
        storedPath: storedConfig.path,
        resolvedPath,
    }, null, 2));
}

if (require.main === module) {
    main();
}

/**
 * VelociForge Terminal Logger & Aesthetic Visual Utilities
 * Rich ANSI styling, ASCII banners, progress indicators, tables, and timing.
 */

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m",
    blue: "\x1b[34m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    gray: "\x1b[90m",
    bgCyan: "\x1b[46m",
    bgGreen: "\x1b[42m",
    bgMagenta: "\x1b[45m",
    whiteBold: "\x1b[1m\x1b[37m"
};

class Logger {
    static banner() {
        console.log(`
${colors.cyan}${colors.bright}  __     _____ _     ___   ____ ___ _____ ___  ____   ____ _____ 
  \\ \\   / ____| |   / _ \\ / ___|_ _|  ___/ _ \\|  _ \\ / ___| ____|
   \\ \\ |  _|  | |  | | | | |    | || |_ | | | | |_) | |  _|  _|  
   / / | |___ | |__| |_| | |___ | ||  _|| |_| |  _ <| |_| | |___ 
  /_/  |_____|_____|\\___/ \\____|___|_|   \\___/|_| \\_\\\\____|_____|${colors.reset}
${colors.gray} High-Speed Virtualized Package Engine & Ultra-Fast CI Restorer v1.0.0${colors.reset}
        `);
    }

    static info(msg) {
        console.log(`${colors.cyan}ℹ [VelociForge]${colors.reset} ${msg}`);
    }

    static success(msg) {
        console.log(`${colors.green}✔ [VelociForge]${colors.reset} ${colors.bright}${msg}${colors.reset}`);
    }

    static warn(msg) {
        console.log(`${colors.yellow}⚠ [VelociForge Warning]${colors.reset} ${msg}`);
    }

    static error(msg) {
        console.error(`${colors.red}✖ [VelociForge Error]${colors.reset} ${colors.bright}${msg}${colors.reset}`);
    }

    static metric(label, value, extra = "") {
        console.log(`  ${colors.gray}•${colors.reset} ${colors.bright}${label.padEnd(26)}:${colors.reset} ${colors.cyan}${value}${colors.reset} ${colors.gray}${extra}${colors.reset}`);
    }

    static table(headers, rows) {
        console.log('\n' + colors.gray + '┌' + '─'.repeat(70) + '┐' + colors.reset);
        const headerStr = headers.map((h, i) => h.padEnd(i === 0 ? 30 : 18)).join('');
        console.log(`${colors.gray}│${colors.reset} ${colors.whiteBold}${headerStr}${colors.reset}`);
        console.log(colors.gray + '├' + '─'.repeat(70) + '┤' + colors.reset);
        for (const row of rows) {
            const rowStr = row.map((r, i) => String(r).padEnd(i === 0 ? 30 : 18)).join('');
            console.log(`${colors.gray}│${colors.reset} ${colors.cyan}${rowStr}${colors.reset}`);
        }
        console.log(colors.gray + '└' + '─'.repeat(70) + '┘' + colors.reset + '\n');
    }

    static timerStart(label) {
        return { label, start: process.hrtime() };
    }

    static timerEnd(timerObj) {
        const diff = process.hrtime(timerObj.start);
        const ms = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
        return `${ms}ms`;
    }

    static formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

module.exports = { Logger, colors };

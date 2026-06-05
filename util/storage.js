const permits = [];
const activeRings = new Map();

// wipe old permits
setInterval(() => {
    const now = Date.now();

    for (let i = permits.length - 1; i >= 0; i--) {
        if (permits[i].expiresAt < now) {
            permits.splice(i, 1);
        }
    }
}, 60 * 1000);

async function startRing(user) {
    if (activeRings.has(user.id)) return;

    const session = {
        active: true,
        count: 0
    };

    activeRings.set(user.id, session);

    const interval = setInterval(async () => {
        const data = activeRings.get(user.id);

        if (!data || !data.active) {
            clearInterval(interval);
            activeRings.delete(user.id);
            return;
        }

        if (data.count >= 10) {
            clearInterval(interval);
            activeRings.delete(user.id);
            return;
        }

        try {
            await user.send(`<@${user.id}> ring ring ${data.count + 1}`);
        } catch {
            clearInterval(interval);
            activeRings.delete(user.id);
            return;
        }

        data.count++;
    }, 3000);
}

module.exports = { permits, activeRings, startRing };

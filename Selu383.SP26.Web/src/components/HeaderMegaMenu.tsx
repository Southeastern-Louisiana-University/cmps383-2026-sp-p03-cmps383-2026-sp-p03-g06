import { useDisclosure } from '@mantine/hooks';
import {
    IconChevronDown,
    IconCup,
    IconBurger,
    IconCakeRoll,
    IconBreadFilled,
} from '@tabler/icons-react';
import {
    Box,
    Burger,
    Button,
    Center,
    Divider,
    Group,
    HoverCard,
    Text,
    ThemeIcon,
    UnstyledButton,
    Container,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import classes from './HeaderMegaMenu.module.scss';

const menuCategories = [
    { icon: IconCup, title: 'Drinks', description: 'Coffee, lattes, juice and more', slug: 'Drinks' },
    { icon: IconCakeRoll, title: 'Sweet Crepes', description: 'Untamed sweetness in every bite', slug: 'Sweet Crepes' },
    { icon: IconBreadFilled, title: 'Savory Crepes', description: 'Fuel your hunt with bold, savory flavors', slug: 'Savory Crepes' },
    { icon: IconBurger, title: 'Bagels', description: 'Come take a bite of our freshly baked bagels', slug: 'Bagels' },
];

export function HeaderMegaMenu() {
    const [drawerOpened, { toggle: toggleDrawer }] = useDisclosure(false);
    const navigate = useNavigate();

    const [user, setUser] = useState<{ name?: string; username?: string } | null>(null);
    const [menuOpened, setMenuOpened] = useState(false);

    useEffect(() => {
        const syncUser = () => {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) { setUser(null); return; }
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem("user");
                setUser(null);
            }
        };

        syncUser();
        window.addEventListener("userChange", syncUser);
        window.addEventListener("storage", syncUser);
        return () => {
            window.removeEventListener("userChange", syncUser);
            window.removeEventListener("storage", syncUser);
        };
    }, []);

    const dropdownLinks = menuCategories.map((item) => (
        <UnstyledButton
            className={classes.subLink}
            key={item.title}
            onClick={() => navigate(`/order?category=${encodeURIComponent(item.slug)}`)}
        >
            <Group wrap="nowrap" align="flex-start">
                <ThemeIcon size={34} variant="default" radius="md">
                    <item.icon size={20} color="#2d6a4f" />
                </ThemeIcon>
                <div>
                    <Text size="sm" fw={500}>{item.title}</Text>
                    <Text size="xs" c="dimmed">{item.description}</Text>
                </div>
            </Group>
        </UnstyledButton>
    ));

    return (
        <Box>
            <header className={classes.header}>
                <Container fluid className={classes.inner}>

                    {/* LOGO */}
                    <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%', background: '#7bf1a8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            ☕
                        </div>
                        <span style={{ fontWeight: 600, color: '#1a4731' }}>Caffeinated Lions</span>
                    </a>

                    {/* NAV */}
                    <div className={classes.nav}>
                        <a href="/" className={classes.link}>Home</a>

                        <HoverCard width={480} shadow="md">
                            <HoverCard.Target>
                                <a className={classes.link}>
                                    <Center inline>
                                        Order
                                        <IconChevronDown size={16} />
                                    </Center>
                                </a>
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Group px="md">
                                    <Text fw={500}>Our menu</Text>
                                </Group>
                                <Divider my="sm" />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                                    {dropdownLinks}
                                </div>
                            </HoverCard.Dropdown>
                        </HoverCard>

                        <a href="/rewards" className={classes.link}>Rewards</a>
                        {user && <a href="/profile" className={classes.link}>Profile</a>}
                    </div>

                    {/* AUTH */}
                    <Group visibleFrom="sm">
                        {user ? (
                            <div style={{ position: "relative" }}>
                                <Button
                                    radius="xl"
                                    onClick={() => setMenuOpened((o) => !o)}
                                    style={{ background: "#7bf1a8", color: "#1a4731", fontWeight: 600 }}
                                >
                                    Hi, {user.username || user.name || "User"}
                                </Button>
                                {menuOpened && (
                                    <div style={{
                                        position: "absolute", right: 0, marginTop: 8,
                                        background: "white", borderRadius: 10,
                                        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                                        overflow: "hidden", minWidth: 150
                                    }}>
                                        <button
                                            onClick={() => { setMenuOpened(false); navigate("/profile"); }}
                                            style={{ width: "100%", padding: "10px", textAlign: "left", background: "white", border: "none", cursor: "pointer" }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                                        >Profile</button>
                                        <button
                                            onClick={() => { localStorage.clear(); window.dispatchEvent(new Event("userChange")); navigate("/signin"); }}
                                            style={{ width: "100%", padding: "10px", textAlign: "left", background: "white", border: "none", cursor: "pointer", color: "#d9534f" }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = "#fff5f5"}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                                        >Log out</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Button variant="outline" radius="xl" onClick={() => navigate("/signin")}
                                    style={{ borderColor: "#7bf1a8", color: "#1a4731" }}>
                                    Log in
                                </Button>
                                <Button radius="xl" onClick={() => navigate("/signup")}
                                    style={{ background: "#7bf1a8", color: "#1a4731" }}>
                                    Sign up
                                </Button>
                            </>
                        )}
                    </Group>

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
                </Container>
            </header>
        </Box>
    );
}
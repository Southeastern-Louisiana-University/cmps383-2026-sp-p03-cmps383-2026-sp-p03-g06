import {
    IconChevronDown,
    IconCup,
    IconFlame,
    IconLeaf,
    IconCookie,
    IconSnowflake,
} from '@tabler/icons-react';
import {
    Anchor,
    Box,
    Burger,
    Button,
    Center,
    Collapse,
    Divider,
    Drawer,
    Group,
    HoverCard,
    ScrollArea,
    Text,
    ThemeIcon,
    UnstyledButton,
    useMantineTheme,
    Container,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import classes from './HeaderMegaMenu.module.scss';

const menuCategories = [
    { icon: IconFlame, title: 'Hot drinks', description: 'Espresso, lattes, cappuccinos and more' },
    { icon: IconSnowflake, title: 'Cold drinks', description: 'Cold brew, iced lattes, refreshers' },
    { icon: IconLeaf, title: 'Matcha & tea', description: 'Ceremonial matcha, chai, herbal teas' },
    { icon: IconCookie, title: 'Food', description: 'Pastries, sandwiches, and snacks' },
    { icon: IconCup, title: 'Seasonal', description: 'Limited time drinks and specials' },
];

export function HeaderMegaMenu() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const theme = useMantineTheme();
    const navigate = useNavigate();

    const dropdownLinks = menuCategories.map((item) => (
        <UnstyledButton
            className={classes.subLink}
            key={item.title}
            onClick={() => navigate('/order')}
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
        <Box style={{ width: '100%', margin: 0, padding: 0 }}>
            <header className={classes.header}>
                <Container fluid className={classes.inner}>

                    {/* LEFT — Logo */}
                    <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#7bf1a8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                            ☕
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 16, color: '#1a4731' }}>Caffeinated Lions</span>
                    </a>

                    {/* CENTER — Nav */}
                    <div className={classes.nav}>
                        <a href="/" className={classes.link}>Home</a>

                        {/* ORDER DROPDOWN */}
                        <HoverCard width={480} position="bottom" radius="md" shadow="md" withinPortal>
                            <HoverCard.Target>
                                <a className={classes.link} style={{ cursor: 'pointer' }}>
                                    <Center inline>
                                        <Box component="span" mr={5}>Order</Box>
                                        <IconChevronDown size={16} color={theme.colors.gray[6]} />
                                    </Center>
                                </a>
                            </HoverCard.Target>

                            <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                                <Group justify="space-between" px="md" mb={4}>
                                    <Text fw={500}>Our menu</Text>
                                    <Anchor href="/order" fz="xs" c="green">View full menu</Anchor>
                                </Group>

                                <Divider mb="sm" />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: '0 8px 8px' }}>
                                    {dropdownLinks}
                                </div>

                                <div className={classes.dropdownFooter}>
                                    <Group justify="space-between">
                                        <div>
                                            <Text fw={500} fz="sm">Ready to order?</Text>
                                            <Text size="xs" c="dimmed">Skip the line, pick up in store</Text>
                                        </div>
                                        <Button
                                            variant="filled"
                                            color="green"
                                            radius="xl"
                                            onClick={() => navigate('/order')}
                                            style={{ background: '#7bf1a8', color: '#1a4731' }}
                                        >
                                            Order now
                                        </Button>
                                    </Group>
                                </div>
                            </HoverCard.Dropdown>
                        </HoverCard>

                        <a href="/rewards" className={classes.link}>Rewards</a>
                        <a href="/profile" className={classes.link}>Profile</a>
                    </div>

                    {/* RIGHT — Auth */}
                    <Group visibleFrom="sm" className={classes.auth}>
                        <Button variant="default" radius="xl">Log in</Button>
                        <Button radius="xl" className={classes.join}>Sign up</Button>
                    </Group>

                    {/* MOBILE BURGER */}
                    <Burger
                        opened={drawerOpened}
                        onClick={toggleDrawer}
                        hiddenFrom="sm"
                        aria-label="Toggle navigation"
                    />
                </Container>
            </header>

            {/* MOBILE DRAWER */}
            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Caffeinated Lions"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h="calc(100vh - 80px)" mx="-md">
                    <Divider my="sm" />

                    <a href="/" className={classes.link}>Home</a>

                    <UnstyledButton className={classes.link} onClick={toggleLinks}>
                        <Center inline>
                            <Box component="span" mr={5}>Order</Box>
                            <IconChevronDown size={16} color={theme.colors.gray[6]} />
                        </Center>
                    </UnstyledButton>

                    <Collapse expanded={linksOpened}>
                        {menuCategories.map((item) => (
                            <a key={item.title} href="/order" className={classes.link} style={{ paddingLeft: 32, fontSize: 14 }}>
                                {item.title}
                            </a>
                        ))}
                    </Collapse>

                    <a href="/rewards" className={classes.link}>Rewards</a>
                    <a href="/profile" className={classes.link}>Profile</a>

                    <Divider my="sm" />

                    <Group justify="center" grow pb="xl" px="md">
                        <Button variant="default" radius="xl">Log in</Button>
                        <Button radius="xl" className={classes.join}>Sign up</Button>
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}
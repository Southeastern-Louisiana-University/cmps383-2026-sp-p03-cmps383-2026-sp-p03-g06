import Logo from '../assets/Caff-logo.png';

import {
    IconChevronDown,
    IconCup,
    IconBurger,
    IconCakeRoll,
    IconBreadFilled,
} from '@tabler/icons-react';
import {
    Anchor,
    Box,
    Button,
    Center,
    Divider,
    Group,
    HoverCard,
    Text,
    ThemeIcon,
    UnstyledButton,
    useMantineTheme,
    Container,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import classes from './HeaderMegaMenu.module.scss';

const menuCategories = [
    { icon: IconCup, title: 'Drinks', description: 'Coffee, lattes, juice and more', slug: 'drinks' },
    { icon: IconCakeRoll, title: 'Sweet Crepes', description: 'Untamed sweetness in every bite', slug: 'sweet-crepes' },
    { icon: IconBreadFilled, title: 'Savory Crepes', description: 'Fuel your hunt with bold, savory flavors', slug: 'savory-crepes' },
    { icon: IconBurger, title: 'Bagels', description: 'Come take a bite of our freshly baked bagels', slug: 'bagels' },

];

export function HeaderMegaMenu() {
    const theme = useMantineTheme();
    const navigate = useNavigate();

    const dropdownLinks = menuCategories.map((item) => (
        <UnstyledButton
            className={classes.subLink}
            key={item.title}
            onClick={() => navigate(`/order/${item.slug}`)}
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
                    <a
                        href="/"
                        style={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10
                        }}
                    >
                        <img
                            src={Logo}
                            alt="Caffeinated Lions Logo"
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }}
                        />

                        <span style={{ fontWeight: 600, fontSize: 16, color: '#1a4731' }}>
                            Caffeinated Lions
                        </span>
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
                    <Group className={classes.auth}>
                        <Button variant="default" radius="xl">Log in</Button>
                        <Button radius="xl" className={classes.join}>Sign up</Button>
                    </Group>

                </Container>
            </header>
        </Box>
    );
}
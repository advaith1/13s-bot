import { Client, GatewayIntentBits, Events, Partials, ComponentType, TextInputStyle, ChannelType, MessageFlags } from 'discord.js'
import { token } from './config.json'

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions],
    partials: [Partials.Message, Partials.Reaction]
})

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`)
})

const natalie = '184004745416015872'
const trueEmoji = '1095068960707330098'
const falseEmoji = '1097655366814281780'

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (user.id === natalie && reaction.emoji.id === trueEmoji) {
        const message = await reaction.message.fetch()

        if (message.author.id === natalie) {
            await reaction.users.remove(user.id)
            await reaction.message.react(falseEmoji)
        }
    }
})

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isButton()) {
        await interaction.showModal({
            title: 'Submit Anonymous Feedback',
            customId: 'feedback',
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.TextInput,
                            customId: 'input',
                            style: TextInputStyle.Paragraph,
                            label: 'Feedback',
                            maxLength: 1996,
                            required: true
                        }
                    ]
                }
            ]
        })
    }

    if (interaction.isModalSubmit()) {
        const input = interaction.components[0].components[0]
        if (input.type !== ComponentType.TextInput) return

        const feedbackChannel = client.channels.cache.get('1097657507381518459')
        if (feedbackChannel?.type !== ChannelType.GuildText) return

        await feedbackChannel.send({
            content: `>>> ${input.value}`,
            allowedMentions: { parse: [] },
            flags: MessageFlags.SuppressEmbeds
        })

        await interaction.reply({
            content: 'Thanks for your feedback!',
            ephemeral: true
        })
    }
})

client.login(token)

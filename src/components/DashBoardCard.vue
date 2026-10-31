<template>
    <v-card :color="color" elevation="15" variant="flat">
        <v-card-title>
            <v-icon color="white" size="large" start>{{ icon }}</v-icon>
            <span class="text-white">{{ data }}</span>
        </v-card-title>
        <v-card-subtitle class="text-white">
            {{ title }}
        </v-card-subtitle>
    </v-card>
</template>

<script>
export default {
    props: {
        title: String,
        color: String,
        data: Number,
        icon: String
    }
}
</script>